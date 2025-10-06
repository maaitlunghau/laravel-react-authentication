export default function NotFound() {
    return (
        <div className="notfound-root">
            <section className="notfound-section">
                <div className="notfound-container">
                    <div className="notfound-center">
                        <div className="notfound-box">
                            <div className="notfound-text">
                                {/* Content Box */}
                                <div className="notfound-content">
                                    <h3 className="notfound-subtitle">
                                        404 - Not Found
                                    </h3>
                                    <p className="notfound-message">
                                        The page you are looking for is not available!
                                    </p>
                                </div>

                                {/* 404 Background Section */}
                                <div
                                    className="notfound-bg"
                                    style={{
                                        backgroundImage: "url('/images/not-found-bg.gif')",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
