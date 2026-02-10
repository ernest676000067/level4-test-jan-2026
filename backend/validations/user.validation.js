const z = require('zod');

const userValidation = (req, res, next) => {
    try {
        const schema = z.object({
            first_name: z.string().min(1, "First name is required").max(150, "First name must be at most 150 characters"),
            last_name: z.string().min(1, "Last name is required").max(150, "Last name must be at most 150 characters"),
            category: z.enum(['admin', 'user'], { message: "Category must be 'admin' or 'user'" }).optional()
        });
        const validData = schema.parse(req.body);
        req.body = validData;
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = JSON.parse(error.message);
            return res.status(400).json({
                path: errors.map((err) => ({
                    field: err.path[0],
                    message: err.message,
                })),
                message: "Validation error please check your input",
            });
        }
    }
};

module.exports = { userValidation };
