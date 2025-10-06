import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function VerificationSuccess() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const message = searchParams.get('message');

    useEffect(() => {
        if (message) {
            toast.info(message);
        } else {
            toast.success('Email verified successfully! You can now login');
        }

        // redirect to login after 3 seconds
        const timer = setTimeout(() => {
            navigate('/login');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate, message]);

    return (
        <div className='login-signup-form animated fadeInDown'>
            <div className="form" style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '60px', color: '#4CAF50', marginBottom: '20px' }}>
                    ✓
                </div>
                <h1 className="title">Email Verified!</h1>
                <p style={{ marginTop: '20px', color: '#666' }}>
                    {message || 'Your email has been verified successfully.'}
                </p>
                <p style={{ marginTop: '10px', color: '#999' }}>
                    Redirecting to login page...
                </p>
            </div>
        </div>
    );
}