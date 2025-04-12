# Fixing EAS Build Issues

If you're encountering the "Invalid UUID appId" error when trying to build with EAS, follow these steps to fix it:

## Step 1: Reset your EAS configuration

The error occurs because you're trying to use a placeholder or invalid project ID. Let's start fresh:

```bash
# Login to EAS first
eas login

# Create a new project 
eas project:create
```

When prompted, enter your app details:
- Choose a unique project name
- Select your account to create the project under

## Step 2: Update your configuration

After creating the project, EAS will automatically update your app.json file with the correct project ID.

## Step 3: Build your app

Now you can run your build command:

```bash
# For Android preview build
npm run android:preview
```

## Common Issues and Solutions

### "Invalid UUID appId" Error

This occurs when:
1. You're using a placeholder project ID
2. The project ID doesn't exist in your EAS account
3. The project wasn't properly created

**Solution**: Create a new project with `eas project:create` and let it update your app.json file.

### Missing appVersionSource Warning

If you see warnings about `cli.appVersionSource`:

**Solution**: Add this to your eas.json file:

```json
{
  "cli": {
    "version": ">= 5.5.0",
    "appVersionSource": "remote"
  }
}
```

### Build process fails with credentials error

If you face credentials issues:

**Solution**: Let EAS handle credentials for you:

```bash
eas credentials
```

## Getting Help

If you continue to encounter issues:

1. Check the EAS status page: https://status.expo.dev/
2. Review build logs: `eas build:list` and `eas build:view`
3. Consult the EAS documentation: https://docs.expo.dev/build/introduction/ 