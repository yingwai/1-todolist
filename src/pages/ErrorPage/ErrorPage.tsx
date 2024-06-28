import React from "react";

export function ErrorPage() {
    return (
        <div
            className='error-page'
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div>
                <h1>Oops!</h1>
                <p>Page not found 404</p>
            </div>
        </div>
    );
}
