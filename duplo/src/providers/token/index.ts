import jwt from "jsonwebtoken";
import { envs } from "../../envs";

interface AccessTokenPayload {
	email: string;
}

export class AccessToken {
	public static generate(content: AccessTokenPayload) {
		const tokenContent = { content };

		return jwt.sign(
			tokenContent,
			envs.JWT_KEY,
			{ expiresIn: envs.JWT_TIME },
		);
	}

	public static check(token: string) {
		try {
			const { content } = jwt.verify(
				token,
				envs.JWT_KEY,
			) as jwt.JwtPayload;

			return content as AccessTokenPayload;
		} catch {
			return null;
		}
	}
}
