# Super Admin Setup 
## Production Workflow 
- Initial production build requires a SUPER_ADMIN_EMAIL environment variable to initialize admin setup.  
- Production build sends email to SUPER_ADMIN_EMAIL address.
- A missing or invalid environment variable will fail the initial build.
- Failure to confirm email has been sent will fail the initial build.
- Email verification link takes site owner to setup form to complete admin account setup. 
- A resend verification email option is available if admin setup fails

```mermaid
%%{init: {
  "theme": "dark", 
  "themeVariables": { 
    "primaryColor": "#ff6e6e", 
    "secondaryColor": "#feb236", 
    "tertiaryColor": "#6cb1ff" 
  },
  "flowchart": {
    "htmlLabels": true,
    "curve": "basis"
  }
}}%%

graph TD
    Start(["Start Build"]) --> PreStartup["Execute admin-setup-production.ts"]
    PreStartup --> CheckDB{"Check DB for existing admin"}
    CheckDB -->|"Admin exists"| ContinueBuild["Continue build"]

    CheckDB -->|"No admin exists"| CheckEnvVar{"Verify <br/>SUPER_ADMIN_EMAIL<br/> env var"}
    
    CheckEnvVar -->|"Missing or Invalid Format"| FailBuild1(["Fail build with error"])
    CheckEnvVar -->|"Valid"| BeginTransaction["Begin DB transaction"]
    
    BeginTransaction --> CreateAdmin["Create super admin user"]
    CreateAdmin --> GenerateToken["Generate 48h reset token"]
    GenerateToken --> SendEmail["Attempt to send email"]
    SendEmail --> EmailSent{"Email received?"}
    
    EmailSent -->|"Success"| CommitTransaction["Commit transaction"]
    EmailSent -->|"Failure"| RollbackTransaction["Rollback transaction"]
    RollbackTransaction --> FailBuild3(["Fail build with error"])
    StartApp --> ContinueBuild
    ContinueBuild --> BuildComplete(["Build Complete"])
    
    CommitTransaction --> StartApp["Set app state 'in-progress'"]
    
    StartApp -.-> UserNavigateRoot["User navigates to website_url"]
    UserNavigateRoot --> RenderSplash["Render setup-in-progress in public site header"]
    
    EmailSent -->|"Success"| UserReceiveEmail["User receives email"]
    UserReceiveEmail --> UserClicksLink["User clicks reset link"]
    UserClicksLink --> RenderResetScreen["Load admin setup form"]
    RenderResetScreen --> UserSetsPassword["User sets name and password"]
    
    UserSetsPassword -->|"Success"| MarkSetupComplete["Mark setup complete"]
    MarkSetupComplete --> SetReadyState(["Set app state 'ready'"])
    UserSetsPassword -->|"Failure"| PasswordResetFail(["Prompts user to resend verification email."])
    PasswordResetFail -.-> UserReceiveEmail
    
    classDef start fill:#0066cc
    classDef failure fill:#cc0000
    classDef success fill:#008800
    
    class Start start
    class FailBuild1,FailBuild3 failure
    class BuildComplete,SetReadyState success
```


    
### UI    

Initial Sucessful Build    
![Initial Build](./images/super_admin_setup_prod_01.png)
---
Follow Up Successful Build
![Follow Up Build](./images/super_admin_setup_prod_02.png)
---
Initial Failed Build (missing SUPER_ADMIN_EMAIL env variable)
![Failed Build with missing SUPER_ADMIN_EMAIL](./images/super_admin_setup_prod_03.png)
---
![App In Progress Notification](./images/super_admin_setup_prod_05.png)
---
![Super Admin Setup Email](./images/super_admin_setup_prod_06.png)
---
![Super Admin Setup Form](./images/super_admin_setup_prod_07.png)
---
![Super Admin Setup Failed](./images/super_admin_setup_prod_08.png)
---

## DEV Workflow 
- Iniitial dev build creates an automated dev super admin account 
- Dev environment includes a one-click login for super admin access 

```mermaid
graph TD
    %% Build process flow
    Start1[Start Build] --> PreStartup["Execute admin-setup-dev.ts"]
    PreStartup --> CheckDB{"Check DB for existing admin"}
    
    CheckDB -->|"Admin exists"| ContinueStartup["Continue startup"]
    CheckDB -->|"No admin exists"| CreateAdminAction["Create SUPER_ADMIN user with default password"]
    
    CreateAdminAction --> AdminCreated{"Creation successful?"}
    AdminCreated -->|"Yes"| ContinueStartup
    AdminCreated -->|"No"| FailBuild[Fail build]
    ContinueStartup --> BuildComplete[Build Complete]
    
    %% User flow from homepage
    Start2[User Navigates to /login] --> ClickHomeButton["Click 'Super Admin Login' button"]
    ClickHomeButton --> AutoLoginProcess["Auto-login as super admin"]
        
    AutoLoginProcess --> AdminDashboard["Access admin dashboard"]
    AdminDashboard --> End[End]
    
    classDef startPoint fill:#0066cc,stroke:#003366,stroke-width:2px,rx:10,ry:10
    classDef successPoint fill:#008800,stroke:#005500,stroke-width:2px,rx:10,ry:10
    classDef failPoint fill:#cc0000,stroke:#990000,stroke-width:2px,rx:10,ry:10
    
    class Start1,Start2,Start3 startPoint
    class End,BuildComplete successPoint
    class FailBuild failPoint
```

### UI

![Initial Build](./images/super_admin_setup_dev_01.png)
---
![Follow Up Build](./images/super_admin_setup_dev_02.png)
---
![One Click Super Admin Login](./images/super_admin_setup_dev_03.png)
---