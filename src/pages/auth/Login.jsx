import { useFormik } from 'formik';
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { login } from '../../services/AuthService';
import * as Yup from 'yup';
import ThemeToggle from '../../components/ThemeToggle';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const videoTimeoutRef = useRef(null);

    const { login: authLogin, isAuthenticated, isLoading } = useAuth();
    const isLoggingIn = useRef(false);

    useEffect(() => {
        if (!isLoading && isAuthenticated && !isLoggingIn.current) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    useEffect(() => {
        // Set timeout to detect if video fails to load
        if (!videoLoaded && !videoError) {
            videoTimeoutRef.current = setTimeout(() => {
                if (!videoLoaded) {
                    setVideoError(true);
                }
            }, 5000);
        }

        return () => {
            if (videoTimeoutRef.current) {
                clearTimeout(videoTimeoutRef.current);
            }
        };
    }, [videoLoaded, videoError]);

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .email('Enter a valid email address.')
            .required('Email is required.')
            .test('is-valid-email', 'Enter a valid email address.', value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)),
        password: Yup.string().required('Password is required.'),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema,
        enableReinitialize: false,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            isLoggingIn.current = true;

            try {
                const res = await login({
                    email: values.username.toLowerCase().trim(),
                    password: values.password,
                });
                const { accessToken, refreshToken } = res.data.data;
                await authLogin({ accessToken, refreshToken }, rememberMe);
                toast.success(res?.data?.message || 'Login successful!');
                navigate('/systemcheck', { replace: true });
            } catch (err) {
                isLoggingIn.current = false;
                toast.error(err?.response?.data?.message || 'An error occurred during login.');
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
            <div className="relative w-full lg:w-1/2 h-full overflow-hidden z-0 rounded-[0] md:rounded-[20px]">
                {/* Background Image Fallback */}
                <div className={`absolute inset-0 bg-[url(/images/login-image.png)] bg-cover bg-center transition-opacity duration-500 ${videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'}`} />

                {/* Background Video */}
                {!videoError && (
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/J5PTYJMEWFo?si=aY9sO87c85YKAP-W&autoplay=1&mute=1&loop=1&playlist=J5PTYJMEWFo&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[182vh] h-[56.25vw] min-w-full min-h-full"
                            style={{ pointerEvents: 'none' }}
                            onLoad={() => {
                                if (videoTimeoutRef.current) {
                                    clearTimeout(videoTimeoutRef.current);
                                }
                                setVideoLoaded(true);
                            }}
                            onError={() => {
                                if (videoTimeoutRef.current) {
                                    clearTimeout(videoTimeoutRef.current);
                                }
                                setVideoError(true);
                            }}
                        />
                    </div>
                )}

                {/* Overlay Content */}
                <div className="relative h-full flex items-center justify-center p-0 md:p-8 z-10">
                    <div className="bg-[#16161666] backdrop-blur-lg rounded-[20px] px-[30px] py-[12px] md:px-[50px] md:py-[24px] text-center">
                        <h1 className="text-[38px] xl:text-[66px] text-[#FFF7D0] mb-2 tracking-[-3%] leading-[36px] md:leading-[62px]">
                            <span className="font-light">AI</span> Skill Builder
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-medium">Your personal facilitator for<br />professional growth.</p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10 rounded-[24px]">
                <div className="w-full max-w-md">
                    <div className="mb-[16px]">
                        <ThemeToggle />
                    </div>

                    <h2 className={`text-3xl md:text-4xl font-semibold text-center md:text-left mb-8  ${isDark ? 'text-white' : 'text-[#242424]'}`}>
                        Login to <br className="block md:hidden" />
                        your account
                    </h2>

                    <form onSubmit={formik.handleSubmit}>
                        <div className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label className={`block mb-[6px] text-[16px] ${isDark ? 'text-white' : 'text-[#757575]'}`}>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formik.values.username.toLowerCase().trim()}
                                    onChange={e => {
                                        formik.setFieldValue('username', e.target.value.toLowerCase().trim());
                                    }}
                                    onBlur={e => {
                                        formik.setFieldValue('username', e.target.value.toLowerCase().trim());
                                        formik.handleBlur(e);
                                    }}
                                    placeholder="username"
                                    className={`w-full bg-transparent border-b-2 text-[20px] ${isDark ? 'border-[#BDBDBD] text-white placeholder-[#CECECE]' : 'border-[#BDBDBD] text-[#212121] placeholder-[#212121]'
                                        } focus:outline-none focus:border-blue-500 transition-colors`}
                                />
                                {formik.touched.username && formik.errors.username ? <p className="mt-1 text-sm text-red-500">{formik.errors.username}</p> : null}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className={`block mb-2 text-[16px] ${isDark ? 'text-white' : 'text-[#757575]'}`}>Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="password"
                                        className={`w-full bg-transparent border-b-2 text-[20px] ${isDark ? 'border-[#BDBDBD] text-white placeholder-[#CECECE]' : 'border-[#BDBDBD] text-[#212121] placeholder-[#212121]'
                                            } focus:outline-none focus:border-blue-500 transition-colors`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
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
                                {formik.touched.password && formik.errors.password ? <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p> : null}
                            </div>

                            {/* Remember Me and Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="sr-only" />
                                    <div
                                        className={`w-[26px] h-[26px] border-2 rounded flex items-center justify-center mr-2 bg-white ${isDark
                                            ? rememberMe
                                                ? 'bg-white border-[#EBEBEB]'
                                                : 'border-[#EBEBEB]'
                                            : rememberMe
                                                ? 'bg-white border-[#EBEBEB]'
                                                : 'border-[#EBEBEB]'
                                            } transition-colors`}
                                    >
                                        {rememberMe && (
                                            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0.647461 4.58607L5.80388 9.85644L14.8276 0.633301" stroke="#908471" stroke-width="1.81169" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`text-sm ${isDark ? 'text-white' : 'text-[#757575]'}`}>Remember me</span>
                                </label>
                                <Link
                                    to="/forget-password"
                                    className={`text-sm hover:underline ${isDark ? 'text-[#757575] hover:text-white' : 'text-[#757575] hover:text-black'
                                        } transition-colors`}
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <Button type="submit" disabled={formik.isSubmitting} className="mt-[56px]">
                            <div className="flex items-center justify-center gap-2">
                                {formik.isSubmitting && <span className="w-5 h-5 border-4 border-[#908471] border-t-[#CAD3AC] rounded-full animate-spin" />}
                                <span>{formik.isSubmitting ? 'Signing in...' : 'Sign in'}</span>
                            </div>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
