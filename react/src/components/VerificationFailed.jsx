import { Link, useSearchParams } from "react-router-dom"


export default function VerificationFailed() {
    const [searchParams] = useSearchParams();
    const message = searchParams.get('message');

    return (
        <div className='login-signup-form animated fadeInDown'>
            <div className="form" style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '60px', color: '#f44336', marginBottom: '20px' }}>
                    ✗
                </div>
                <h1 className="title">Verification Failed</h1>
                <p style={{ marginTop: '20px', color: '#666' }}>
                    {message || 'The verification link is invalid or has expired.'}
                </p>
                <Link
                    to="/login"
                    className="btn btn-block"
                    style={{ marginTop: '30px' }}>
                    Go to Login
                </Link>
            </div>
        </div>
    )
}
