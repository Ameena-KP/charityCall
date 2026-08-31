import Navbar from "../../components/Navbar";

function Home() {

    return (

        <>

            <Navbar />

            {/* Hero Section */}

            <section
                id="home"
                className="container text-center mt-5"
            >

                <h1 className="display-4">

                    Help People, Change Lives

                </h1>

                <p className="lead">

                    CharityCall connects donors with people
                    who genuinely need help.

                </p>

                <button className="btn btn-primary me-3">

                    Request Help

                </button>

                <button className="btn btn-success">

                    Donate Now

                </button>

            </section>

            {/* About */}

            <section
                id="about"
                className="container mt-5"
            >

                <h2>

                    About CharityCall

                </h2>

                <p>

                    CharityCall is an online platform where
                    users can request help and donors can
                    donate essential items. Every request is
                    verified by the team before approval.

                </p>

            </section>

            {/* Features */}

            <section className="container mt-5">

                <h2>

                    Features

                </h2>

                <div className="row">

                    <div className="col-md-3">

                        <div className="card p-3">

                            User Registration

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card p-3">

                            Charity Requests

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card p-3">

                            Donate Items

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card p-3">

                            Team Verification

                        </div>

                    </div>

                </div>

            </section>

            {/* Contact */}

            <section
                id="contact"
                className="container mt-5 mb-5"
            >

                <h2>

                    Contact Us

                </h2>

                <p>

                    Email :
                    charitycall@gmail.com

                </p>

                <p>

                    Phone :
                    +91 9876543210

                </p>

            </section>

            {/* Footer */}

            <footer className="bg-dark text-white text-center p-3">

                © 2026 CharityCall

            </footer>

        </>

    );

}

export default Home;