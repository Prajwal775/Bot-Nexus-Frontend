import api from './axios';

/**
 * Login API
 * Matches:
 * POST http://0.0.0.0:8001/api/v1/auth/token
 * Content-Type: application/x-www-form-urlencoded
 */
export const loginApi = async (
  username: string,
  password: string
) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const { data } = await api.post(
    '/api/v1/auth/token',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data;
};
/**
 * Signup / Register API
 * POST /api/v1/auth/register
 * Content-Type: application/json
 */
export const signupApi = async (
  fullName: string,
  email: string,
  password: string
) => {
  const { data } = await api.post(
    '/api/v1/auth/register',
    {
      full_name: fullName,
      email,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return data;
};
