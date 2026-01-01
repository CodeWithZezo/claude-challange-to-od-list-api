import { User, Organization, RefreshToken } from "../../models";
import { RegisterDTO, LoginDTO, AuthResponse } from "../../types/auth.types";
import { PasswordUtils } from "../../utils/password.utils";
import { JWTUtils } from "../../utils/jwt.utils";
import { Role } from "../../models/enums";
export class AuthService {
  async register(data: RegisterDTO): Promise<AuthResponse> {
    //firstly we validate the password
    const passwordValidation = PasswordUtils.validate(data.password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.errors.join(", "));
    }

    //check if user already exsist
    const exsistingUser = await User.findOne({ email: data.email });
    if (exsistingUser) {
      throw new Error("user already exisit with this email");
    }

    //! is ki samaj ni ha sabi ka q kar rha ya kam
    //check organization if provided
    let organizationId: string;
    if (data.organizationName && data.subdomain) {
      const existingOrg = await Organization.findOne({
        subdomain: data.subdomain,
      });
      if (existingOrg) {
        throw new Error("Organization with this subdomain already exists");
      }

      const organization = await Organization.create({
        name: data.organizationName,
        subdomain: data.subdomain,
        plan: "free",
      });
      organizationId = organization._id;
    } else {
      throw new Error("Organization details are required");
    }

    //now hasing password
    const hashPassword = await PasswordUtils.hash(data.password);

    // now creating user
    const user = await User.create({
      email: data.email,
      password: hashPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: Role.ADMIN,
      organizationId,
      isActive: true,
    });

    //generate token
    return this.generateAuthResponse(user);
  }

  async login(data: any): Promise<AuthResponse>{
    const user = await User.findOne({email: data.email}).select('+password')
    if(!user){
        throw new Error('invalid credentials')
    }

    if(!user.isActive){
        throw new Error('Account is deactivated')
    }

    const isPasswordValid = await PasswordUtils.compare(data.password,user.password)

    if(!isPasswordValid){
        throw new Error('invalid credentials')
    }

    return this.generateAuthResponse(user)
  }
  
  async refreshToken(refreshToken:string): Promise<AuthResponse>{
    let payload
    try {
        payload = JWTUtils.verifyRefreshToken(refreshToken)
    } catch (error) {
        throw new Error('invalid ot expired token') 
    }

    const storedToken = await RefreshToken.findOne({
        token: refreshToken,
        userId: payload.userId
    })
    
    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    if (new Date() > storedToken.expiresAt) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      throw new Error('Refresh token expired');
    }

     const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    await RefreshToken.deleteOne({ _id: storedToken._id });

    return this.generateAuthResponse(user);
  }


  private async generateAuthResponse(user: any): Promise<AuthResponse> {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };
    const accessToken = JWTUtils.generateAccessToken(payload);
    const refreshToken = JWTUtils.generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt,
    });
    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
      },
      accessToken,
      refreshToken,
    };
  }
}
