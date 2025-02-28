import { NextFunction, Response, Request } from "express";
import User from "../../models/User";
import Address from "../../models/Address";
import { CustomError } from "../../types/customError";

const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.userId) {
    const user = await User.findById(req.body.userId);
    const addressId = req.body.addressId;
    if (user) {
      if (addressId) {
        const address = await Address.findById(addressId);
        if (address) {
          address.addressLine1 = req.body.addressLine1 ?? address.addressLine1;
          address.addressLine2 = req.body.addressLine2 ?? address.addressLine2;
          address.city = req.body.city ?? address.city;
          address.state = req.body.state ?? address.state;
          address.pincode = req.body.pincode ?? address.pincode;
          try {
            await address.save();
            const success = await user.save();
            const userAddress = await success
              .populate({
                path: "address.allAddresses",
                select: "addressLine1 addressLine2 city state pincode",
              })
              .then(async (populatedUser) => {
                return await populatedUser.populate({
                  path: "address.currentAddress",
                  select: "addressLine1 addressLine2 city state pincode",
                });
              });
            res
              .status(201)
              .json({ message: "Address created", address: userAddress });
          } catch (err: any) {
            const error = new CustomError(err.message, 400);
            next(error);
          }
        } else {
          const error = new CustomError("Address not found", 404);
          next(error);
        }
      } else {
        const address = new Address({
          addressLine1: req.body.addressLine1,
          addressLine2: req.body.addressLine2,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
          user: req.body.userId,
        });
        try {
          const addressSaved = await address.save();
          if (!user.address) {
            user.address = { allAddresses: [], currentAddress: null };
          }
          user.address.allAddresses.push(addressSaved._id);
          if (user.address.currentAddress === null) {
            user.address.currentAddress = addressSaved._id;
          }
          const success = await user.save();
          const userAddress = await success
            .populate({
              path: "address.allAddresses",
              select: "addressLine1 addressLine2 city state pincode",
            })
            .then(async (populatedUser) => {
              return await populatedUser.populate({
                path: "address.currentAddress",
                select: "addressLine1 addressLine2 city state pincode",
              });
            });
          res
            .status(201)
            .json({ message: "Address created", address: userAddress });
        } catch (err: any) {
          const error = new CustomError(err.message, 400);
          next(error);
        }
      }
    } else {
      const error = new CustomError("User not found", 404);
      next(error);
    }
  } else {
    const error = new CustomError("User id was not provided", 400);
    next(error);
  }
};

const changeAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req.body.userId);
  if (user && user.address) {
    user.address.currentAddress = req.body.addressId;
    try {
      const changedAddress = await user.save();
      const updatedValue = await changedAddress.populate({
        path: "address.currentAddress",
        select: "addressLine1 addressLine2 city state pincode",
      });
      res
        .status(201)
        .json({ message: "Current address saved", address: updatedValue });
    } catch (err: any) {
      const error = new CustomError(err.message, 404);
      next(error);
    }
  } else {
    const error = new CustomError("User or address not found", 404);
    next(error);
  }
};

const deletAddress = async(req: Request, res: Response, next: NextFunction)=>{
    const id = req.query.param;
    try {
        const success = await Address.deleteOne({_id: id});
        res.status(205).json({message: "record deleted", body: success})
    } catch (err:any) {
        const error = new CustomError(err.message, 500)
        next(error);
    }
}

export { createAddress, changeAddress, deletAddress };
