const z = require('zod');

const contactValidation = (req, res, next) => {
    try {
        const schema = z.object({
            full_name: z.string().min(3, "Full name is required").max(50, "Full name must be at most 50 characters"),
            phone: z.string().max(20, "Phone must be at most 20 characters").optional(),
            email: z.string().email("Invalid email format").max(150, "Email must be at most 150 characters").optional(),
            added_by: z.string().optional()
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

module.exports = { contactValidation };



