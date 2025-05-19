# Invitations

In order to limit registrations by time or specific amount without rebuilding the frontend, the invitation system must reside in the database.

Invitations have this data outside of usual entity id/creation/update/title/description:
- Code which is used in registration form
- Account which created it
- Maximum amount of usages
- Expiration date
- Activation status

Invitations can only be created by accounts with administrator role. All other accounts can only know the invitation code they were registered with, without a way to check its other details.

The registration system must not disambiguate between "invitation is invalid" and "invitation doesn't exist" in its errors messages to client.
