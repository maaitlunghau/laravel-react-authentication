import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosClient from '../axiosClient';

export default function EmailVerificationPending() {
    const location = useLocation();
    const email = location.state?.email || 'youremail@gmail.com';

    const navigate = useNavigate();

    const [isResending, setIsResending] = useState(false);
    const [canResend, setCanResend] = useState(true);
    const [second, setSecond] = useState(30);

    const handleResend = async () => {
        if (!canResend) return;

        setIsResending(true);
        setCanResend(false);

        try {
            const response = await axiosClient.post('/email/resend', {
                email: email
            });

            toast.success(response.data.message || 'Verification email sent!');

            // disable resend button for 30 seconds
            setCanResend(false);
            setSecond(30);

            const interval = setInterval(() => {
                setSecond(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setCanResend(true);
                        return 0;
                    }

                    return prev - 1;
                });
            }, 1000);

        } catch (err) {
            console.error(err);

            if (err.response?.status === 409) {
                toast.info(err.response.data.message);
            } else {
                toast.error(err.response.data.message);
            }

            setCanResend(true);
        } finally {
            setIsResending(false);
        }
    }

    return (
        <div className='login-signup-form animated fadeInDown'>
            <div className="form" style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '60px', color: '#2196F3', marginBottom: '20px' }}>
                    ✉️
                </div>

                <h1 className="title">Verify Your Email</h1>

                <p style={{ marginTop: '20px', color: '#666', lineHeight: '1.6' }}>
                    We've sent a verification link to:
                </p>

                <p style={{
                    marginTop: '10px',
                    color: '#2196F3',
                    fontWeight: 'bold',
                    fontSize: '16px'
                }}>
                    {email}
                </p>

                <p style={{ marginTop: '15px', color: '#666', lineHeight: '1.6' }}>
                    Please check your inbox and click the verification link to activate your account.
                </p>

                <button
                    className='btn btn-block'
                    onClick={handleResend}
                    disabled={!canResend || isResending}
                    style={{
                        marginTop: '30px',
                        opacity: canResend ? 1 : 0.6,
                        cursor: canResend ? 'pointer' : 'not-allowed'
                    }}
                >
                    {isResending ? 'Sending...' : 'Resend Verification Email'}
                </button>

                {!canResend && (
                    <p style={{
                        marginTop: '10px',
                        fontSize: '14px',
                        color: '#999'
                    }}>
                        Please wait {second} seconds before resending
                    </p>
                )}

                <p className="message" style={{ marginTop: '20px' }}>
                    Already verified?{' '}
                    <Link to='/login'>
                        Go to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}