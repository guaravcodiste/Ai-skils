import { useFormik } from 'formik';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { forgetPassword } from '../../services/AuthService';
import * as Yup from 'yup';
import ThemeToggle from '../../components/ThemeToggle';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const ForgetPassword = () => {
    const { isDark } = useTheme();
    const [isSuccess, setIsSuccess] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('The entered email address is invalid. Please enter a valid email address.')
            .required('You must enter an email address to proceed.')
            .test('is-valid-email', 'The entered email address is invalid. Please enter a valid email address.', value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema,
        enableReinitialize: false,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);

            try {
                const res = await forgetPassword({ email: values.email.toLowerCase().trim() });
                toast.success(res?.data?.message || 'Password reset link sent to your email!');
                setIsSuccess(true);
            } catch (err) {
                toast.error(err?.response?.data?.message || 'Failed to send reset link. Please try again.');
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
                                Forgot Password?
                            </h2>
                            <p className={`text-sm md:text-base mb-6 text-center md:text-left ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                No worries! Enter your email and we'll send you a link to reset your password.
                            </p>

                            <form onSubmit={formik.handleSubmit}>
                                <div className="space-y-6">
                                    <div>
                                        <label className={`block mb-2 text-[16px] ${isDark ? 'text-white' : 'text-[#757575]'}`}>Email</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={formik.values.email.toLowerCase().trim()}
                                            onChange={e => {
                                                formik.setFieldValue('email', e.target.value.toLowerCase().trim());
                                            }}
                                            onBlur={e => {
                                                formik.setFieldValue('email', e.target.value.toLowerCase().trim());
                                                formik.handleBlur(e);
                                            }}
                                            placeholder="Enter your email"
                                            className={`w-full bg-transparent border-b-2 text-[20px] ${isDark ? 'border-[#BDBDBD] text-white placeholder-gray-400' : 'border-[#BDBDBD] text-[#212121] placeholder-gray-400'
                                                } focus:outline-none focus:border-blue-500 transition-colors`}
                                        />
                                        {formik.touched.email && formik.errors.email ? (
                                            <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
                                        ) : null}
                                    </div>
                                </div>

                                <Button type="submit" disabled={formik.isSubmitting} className="mt-[40px]">
                                    <div className="flex items-center justify-center gap-2">
                                        {formik.isSubmitting && <span className="w-5 h-5 border-4 border-[#908471] border-t-[#CAD3AC] rounded-full animate-spin" />}
                                        <span>{formik.isSubmitting ? 'Sending...' : 'Send Reset Link'}</span>
                                    </div>
                                </Button>

                                <div className="mt-6 text-center">
                                    <Link
                                        to="/login"
                                        className={`text-sm hover:underline ${isDark ? 'text-[#757575] hover:text-white' : 'text-[#757575] hover:text-black'} transition-colors`}
                                    >
                                        ← Back to Login
                                    </Link>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className={`text-3xl md:text-4xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#242424]'}`}>Check your email</h2>
                            <p className={`text-sm md:text-base mb-8 ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                We've sent a password reset link to
                                <br />
                                <span className="font-semibold">{formik.values.email}</span>
                            </p>

                            <Button onClick={() => (window.location.href = '/login')} className="mt-[32px]">
                                Back to Login
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
