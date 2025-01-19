app.checkAuth('/api/check-session', (req, res) => {
        if (req.session.email) {
            res.json({ loggedIn: true });
        } else {
            res.json({ loggedIn: false });
        }
    });