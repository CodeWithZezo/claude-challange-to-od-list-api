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

    //check organization if provided
    let organizationId: string = "";
    //agr organizationId aur subdomain provide ki hoi hogi tu
    // hub check kara ga ka kia wo subdomain exisit karti ha
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
        plan: "FREE",
      });
      organizationId = organization._id.toString();
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

  async login(data: any): Promise<AuthResponse> {
    const user = await User.findOne({ email: data.email }).select("+password");
    if (!user) {
      throw new Error("invalid credentials");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    const isPasswordValid = await PasswordUtils.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("invalid credentials");
    }

    return this.generateAuthResponse(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    let payload;
    try {
      payload = JWTUtils.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new Error("invalid or expired token");
    }

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      userId: payload.userId,
    });

    if (!storedToken) {
      throw new Error("Refresh token not found");
    }

    if (new Date() > storedToken.expiresAt) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      throw new Error("Refresh token expired");
    }

    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new Error("User not found or inactive");
    }

    await RefreshToken.deleteOne({ _id: storedToken._id });

    return this.generateAuthResponse(user);
  }

  async logout(refreshToken: string): Promise<void> {
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    //firtly check new password is correct or valid
    const passwordValidation = PasswordUtils.validate(newPassword)
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.errors.join(", "));
    }
    // then find the user by its id with +password 
    const user = await User.findById(userId).select('+password')

    if(!user){
      throw new Error('user not found')
    }
    //then check the current password
    const isPasswordValid = await PasswordUtils.compare(currentPassword, user.password)
    if(!isPasswordValid){
      throw new Error('current password is not valid ')
    }
    // if current password is valid then we replace the user.password after hash the password   
    user.password = await PasswordUtils.hash(newPassword)
    await user.save()
    // then also delete all the refresh token 
    await RefreshToken.deleteMany({userId:user._id})
  }


  // async forgotPassword(email: string): Promise<void> {
  //   const user = await User.findOne({ email });
  //   if (!user) {
  //     // Don't reveal if user exists
  //     return;
  //   }

  //   // Generate reset token (valid for 1 hour)
  //   const resetToken = jwt.sign(
      // { userId: user._id, type: 'password-reset' },
  //     authConfig.jwt.accessTokenSecret,
  //     { expiresIn: '1h' }
  //   );

  //   // TODO: Send email with reset link
  //   // await emailService.sendPasswordResetEmail(user.email, resetToken);
    
  //   console.log(`Password reset token for ${email}: ${resetToken}`);
  // }


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
