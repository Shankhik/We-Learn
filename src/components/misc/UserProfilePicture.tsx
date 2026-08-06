import { User } from "@/types/mongoDBTypes";
import NextImage from "next/image";

type NextImageProps = Omit<
    React.ComponentProps<typeof NextImage>,
    'src'|'alt'
>;
type UserProfilePictureProps = NextImageProps & {
    alt?: string,
    displayName?: string,
    username?: string,
    profilePicture?: User['profilePicture']
}
/**
 * User Profile picture component requires username and profile picture version
 * @param param0
 * @returns - Returns an optimized user profile image.
 */
export default function UserProfilePicture ({
    width, height, alt,
    username, displayName, profilePicture,
    ...props
}:UserProfilePictureProps){
    if ( !profilePicture || !username ) return null;
    return <NextImage
        alt={alt || displayName || username || "Unknown"}
        loading="eager"
        width={width||700} height={height||700}
        src = {`/media/public/${profilePicture.publicId}?media=${profilePicture.media}&tf=c_fill,ar_1:1&v=${profilePicture.version || ""}`}
        // src = {`/media/public/WeLearn/profile-picture/${username}?media=image&tf=c_fill,ar_1:1&v=${profilePicture}`}
        {...props}
    />
}