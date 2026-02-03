import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { setPassword } from '../../services/AuthService';
import * as Yup from 'yup';
import ThemeToggle from '../../components/ThemeToggle';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const SetPassword = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (!tokenFromUrl) {
            toast.error('Invalid or missing token. Please try again.');
            // navigate('/forget-password');
        } else {
            setToken(tokenFromUrl);
        }
    }, [searchParams, navigate]);

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required('Password is required.')
            .min(8, 'Password must be at least 8 characters long.')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
            .matches(/[0-9]/, 'Password must contain at least one number.')
            .matches(/[@$!%*?&#]/, 'Password must contain at least one special character (@$!%*?&#).'),
        confirmPassword: Yup.string()
            .required('Please confirm your password.')
            .oneOf([Yup.ref('password'), null], 'Passwords must match.'),
    });

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        enableReinitialize: false,
        onSubmit: async (values, { setSubmitting }) => {
            if (!token) {
                toast.error('Invalid token. Please request a new password reset link.');
                return;
            }

            setSubmitting(true);

            try {
                const res = await setPassword({
                    token,
                    password: values.password,
                });
                toast.success(res?.data?.message || 'Password set successfully!');
                setIsSuccess(true);
            } catch (err) {
                toast.error(err?.response?.data?.message || 'Failed to set password. Please try again.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div
            className={`h-screen flex flex-col lg:flex-row p-0 md:p-4 overflow-hidden ${isDark ? 'bg-[#131313]' : ''}`}
            style={
                !isDark
                    ? {
                          background: 'linear-gradient(140deg, rgba(232, 215, 193, 1) 0%, rgba(255, 255, 255, 1) 100%)',
                      }
                    : undefined
            }
        >
            <div className="relative w-full lg:w-1/2 h-full overflow-hidden z-0 bg-[url(/images/login-image.png)] bg-cover bg-center rounded-[0] md:rounded-[20px]">
                <div className="relative h-full flex items-center justify-center p-8">
                    <div className="bg-[#16161666] backdrop-blur-lg rounded-[20px] px-[30px] py-[12px] md:px-[50px] md:py-[24px] text-center">
                        <h1 className="text-[38px] lg:text-[66px] text-[#FFF7D0] mb-2 tracking-[-3%] leading-[36px] md:leading-[62px]">
                            <span className="font-light">AI</span> Skill Builder
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-medium">Sales Training Platform</p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10 rounded-[24px]">
                <div className="w-full max-w-md">
                    <div className="mb-[16px]">
                        <ThemeToggle />
                    </div>

                    {!isSuccess ? (
                        <>
                            <h2 className={`text-3xl md:text-4xl font-semibold text-center md:text-left mb-4 ${isDark ? 'text-white' : 'text-[#242424]'}`}>
                                Set Password
                            </h2>
                            <p className={`text-sm md:text-base mb-6 text-center md:text-left ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                Please enter your new password
                            </p>

                            <form onSubmit={formik.handleSubmit}>
                                <div className="space-y-6">
                                    {/* Password Field */}
                                    <div>
                                        <label className={`block mb-2 text-[16px] ${isDark ? 'text-white' : 'text-[#757575]'}`}>New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Enter your password"
                                                className={`w-full bg-transparent border-b-2 text-[20px] ${
                                                    isDark ? 'border-[#BDBDBD] text-white placeholder-gray-400' : 'border-[#BDBDBD] text-[#212121] placeholder-gray-400'
                                                } focus:outline-none focus:border-blue-500 transition-colors`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                                                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                                                } transition-colors`}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="#BEBEBE" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="#BEBEBE" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {formik.touched.password && formik.errors.password ? (
                                            <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
                                        ) : null}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div>
                                        <label className={`block mb-2 text-[16px] ${isDark ? 'text-white' : 'text-[#757575]'}`}>Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formik.values.confirmPassword}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Confirm your password"
                                                className={`w-full bg-transparent border-b-2 text-[20px] ${
                                                    isDark ? 'border-[#BDBDBD] text-white placeholder-gray-400' : 'border-[#BDBDBD] text-[#212121] placeholder-gray-400'
                                                } focus:outline-none focus:border-blue-500 transition-colors`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                                                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                                                } transition-colors`}
                                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showConfirmPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="#BEBEBE" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="#BEBEBE" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                            <p className="mt-1 text-sm text-red-500">{formik.errors.confirmPassword}</p>
                                        ) : null}
                                    </div>

                                    {/* Password Requirements */}
                                    <div className={`text-xs ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'} space-y-1`}>
                                        <p className="font-medium mb-2">Password must contain:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>At least 8 characters</li>
                                            <li>One uppercase letter</li>
                                            <li>One lowercase letter</li>
                                            <li>One number</li>
                                            <li>One special character (@$!%*?&#)</li>
                                        </ul>
                                    </div>
                                </div>

                                <Button type="submit" disabled={formik.isSubmitting} className="mt-[40px]">
                                    <div className="flex items-center justify-center gap-2">
                                        {formik.isSubmitting && <span className="w-5 h-5 border-4 border-[#908471] border-t-[#CAD3AC] rounded-full animate-spin" />}
                                        <span>{formik.isSubmitting ? 'Setting Password...' : 'Set Password'}</span>
                                    </div>
                                </Button>

                                <div className="mt-6 text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/login')}
                                        className={`text-sm hover:underline ${isDark ? 'text-[#757575] hover:text-white' : 'text-[#757575] hover:text-black'} transition-colors`}
                                    >
                                        ← Back to Login
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            {/* Success Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className={`text-3xl md:text-4xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#242424]'}`}>Password set successfully!</h2>
                            <p className={`text-sm md:text-base mb-8 ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                Your password has been successfully set.
                                <br />
                                You can now login with your credentials.
                            </p>

                            <Button onClick={() => navigate('/login')} className="mt-[32px]">
                                Continue to Login
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SetPassword;
