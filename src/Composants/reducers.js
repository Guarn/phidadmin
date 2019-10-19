export const RDuser = (state, action) => {
    switch (action.type) {
        case "UPDATE":
            return action.user;
        case "CONNEXION":
            return { ...state, connecte: false };
        default:
            throw new Error();
    }
};
