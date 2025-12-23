import bcrypt from 'bcrypt';
import  prisma from '../lib/prisma';
import { generateToken, JWTPayload } from '../utils/jwt';

// User type without password_hash
export type User = {
  id: number;
  username: string;
  email: string | null;
  full_name: string | null;
  investor_category: string | null;
  questionnaire_completed: boolean;
  questionnaire_answers: any;
  risk_score: number | null;
  watchlist: string[] | any; // JSON in MySQL, array in TypeScript
  recently_viewed: string[] | any; // JSON in MySQL, array in TypeScript
  role: string;
  created_at: Date;
  updated_at: Date;
};

export async function register(
  username: string, 
  password: string, 
  email?: string, 
  fullName?: string
): Promise<{ success: boolean; message?: string; status: number }> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return { success: false, message: 'User already exists.', status: 409 };
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user in database
    await prisma.user.create({
      data: {
        username,
        password_hash: passwordHash,
        email: email || null,
        full_name: fullName || null,
      }
    });

    return { success: true, status: 201 };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed.', status: 500 };
  }
}

export async function login(
  username: string, 
  password: string
): Promise<{ success: boolean; token?: string; user?: Omit<User, 'password_hash'>; message?: string }> {
  try {
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return { success: false, message: 'Invalid credentials.' };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return { success: false, message: 'Invalid credentials.' };
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
    });

    // Return user data (without password hash)
    const { password_hash, ...userWithoutPassword } = user;

    // Convert JSON fields to arrays for MySQL compatibility
    return {
      success: true,
      token,
      user: {
        ...userWithoutPassword,
        watchlist: Array.isArray(user.watchlist) ? user.watchlist : (user.watchlist as any) || [],
        recently_viewed: Array.isArray(user.recently_viewed) ? user.recently_viewed : (user.recently_viewed as any) || [],
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed.' };
  }
}

export async function getUserById(userId: number): Promise<Omit<User, 'password_hash'> | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        investor_category: true,
        questionnaire_completed: true,
        questionnaire_answers: true,
        risk_score: true,
        watchlist: true,
        recently_viewed: true,
        role: true,
        created_at: true,
        updated_at: true,
      }
    });

    if (!user) {
      return null;
    }

    // Convert JSON fields to arrays for MySQL compatibility
    return {
      ...user,
      watchlist: Array.isArray(user.watchlist) ? user.watchlist : (user.watchlist as any) || [],
      recently_viewed: Array.isArray(user.recently_viewed) ? user.recently_viewed : (user.recently_viewed as any) || [],
    };
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function updateUser(
  userId: number,
  updates: Partial<Omit<User, 'id' | 'username' | 'password_hash' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; user?: Omit<User, 'password_hash'> }> {
  try {
    const updateData: any = {};

    if (updates.investor_category !== undefined) {
      updateData.investor_category = updates.investor_category;
    }
    if (updates.questionnaire_completed !== undefined) {
      updateData.questionnaire_completed = updates.questionnaire_completed;
    }
    if (updates.questionnaire_answers !== undefined) {
      updateData.questionnaire_answers = updates.questionnaire_answers;
    }
    if (updates.risk_score !== undefined) {
      updateData.risk_score = updates.risk_score;
    }
    if (updates.watchlist !== undefined) {
      // Ensure watchlist is stored as JSON array for MySQL
      updateData.watchlist = Array.isArray(updates.watchlist) ? updates.watchlist : [];
    }
    if (updates.recently_viewed !== undefined) {
      // Ensure recently_viewed is stored as JSON array for MySQL
      updateData.recently_viewed = Array.isArray(updates.recently_viewed) ? updates.recently_viewed : [];
    }
    if (updates.email !== undefined) {
      updateData.email = updates.email;
    }
    if (updates.full_name !== undefined) {
      updateData.full_name = updates.full_name;
    }
    if (updates.role !== undefined) {
      updateData.role = updates.role;
    }

    if (Object.keys(updateData).length === 0) {
      return { success: false };
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        investor_category: true,
        questionnaire_completed: true,
        questionnaire_answers: true,
        risk_score: true,
        watchlist: true,
        recently_viewed: true,
        role: true,
        created_at: true,
        updated_at: true,
      }
    });

    // Convert JSON fields to arrays for MySQL compatibility
    return {
      success: true,
      user: {
        ...user,
        watchlist: Array.isArray(user.watchlist) ? user.watchlist : (user.watchlist as any) || [],
        recently_viewed: Array.isArray(user.recently_viewed) ? user.recently_viewed : (user.recently_viewed as any) || [],
      }
    };
  } catch (error) {
    console.error('Update user error:', error);
    return { success: false };
  }
}

