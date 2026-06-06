CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,

    srp_verifier TEXT NOT NULL,
    srp_salt TEXT NOT NULL,

    encrypted_mvk_ciphertext TEXT NOT NULL,
    encrypted_mvk_nonce TEXT NOT NULL,
    encrypted_mvk_version INTEGER NOT NULL,

    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
