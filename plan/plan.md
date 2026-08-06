27th June 2026

### Route | ADD | `/home/admin-panel`
- Routes:<br/>
`.../dev/email`<br/>
`.../users`<br/>
`.../courses`<br/>

### Route | MODIFY | `/settings/profile/update`
- Create new layout similar to `/auth/[signup|login]`
- Create new api route to handle user profile update.<br/>
In `/api/user` add `profile/[dislpay-name|]`

### Api Route | REMOVE | `/api/upload`
- Make functions for uploading | deleting images.

### Api Route | MODIFY | `/api/user`
* Add:<br/>
`.../update/account/[ password ]`<br/>
`.../update/profile/[ profile-picture | display-name | email ]`<br/>

### Api Route | REMOVE | `/api/otp`
* Used in: `/settings/profile/update?edit=email`

