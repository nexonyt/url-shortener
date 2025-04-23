const isActive = async (req, res) => {
    try {
            res.status(200).json({ active: true });
    }
    catch (err) {
        throw Error(err);
    }
    }

module.exports = { isActive };