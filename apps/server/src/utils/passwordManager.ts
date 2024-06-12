// import bcrypt from 'bcrypt';

// const SALT_ROUNDS = 10; // You can adjust the salt rounds based on your security needs and performance requirements.

// export const hashPassword = async (password: string): Promise<string> => {
//   const salt = await bcrypt.genSalt(SALT_ROUNDS);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   return hashedPassword;
// };

// export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
//     const match = await bcrypt.compare(password, hashedPassword);
//     return match;
//   };