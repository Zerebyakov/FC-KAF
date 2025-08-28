



export const isAunthenticated = (req,res, next) => {
    if (!req.session.user) {
        return res.status(401).json({msg:"Unauthorized"})
    }
    next();
}

export const isAdmin = (req,res,next) => {
    if(!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({msg:"Forbidden: Admin only"})
    }
    next();
};

export const isCustomer = (req,res ,next) =>{
    if(!req.session.user || req.session.role !=='customer') {
        return res.status(403).json({msg:"Forbidden: Customer only"})
    }
    next();
}