# Email Service 

## Development / Testing
The application uses [Mailhog](https://github.com/mailhog/MailHog) for mock email interaction in development and testing. 

All emails are sent to a web UI accessible at:  [http://localhost:8025](http://localhost:8025)

### Mocking email failures  
Mailhog has a "Chaos Monkey" tool called `Jim`.  Enable Jim to simulate different failure cases when sending an email.  

#### In Development 
In dev, `Jim` can be toggled from the web UI, or edited programmatically.  Use 

``` 
# DELETE existing Jim configuration  
# NOTE: You must DELETE a Jim configuation before UPDATING a new version.  
curl -X DELETE http://localhost:8025/api/v2/jim

# UPDATE new Jim configuration 
# this will prevent all emails from being sent 
curl -X POST http://localhost:8025/api/v2/jim -H "Content-Type: application/json" -d '{"DisconnectChance": 1.0, "AcceptChance": 0 }'
``` 

##### In Testing 
- Use `cy.simulateEmailSendFailure([FAILURE_TYPE])` to trigger an update to Jim
- Use `cy.resetMockEmailServer()` to reset/delete a Jim configuration 

## Production
In production, the application can be configured to use an SMTP or custom email API Provider.  

### SMTP
```
# EMAIL_SERVICE_HOST=smtp.sendgrid.net
# EMAIL_SERVICE_USER=apikey
# EMAIL_API_KEY=[YOUR_API_KEY]
```

### Custom API Providers
Some production environments (like Digital Ocean) don't allow outbound access to SMTP ports.     
This platform enables configuration using non-SMTP API providers.    
It currently supports [Sendgrid](https://sendgrid.com/) and [Resend](https://resend.com/).    
```
CUSTOM_EMAIL_PROVIDER=[sendgrid or resend]
EMAIL_API_KEY=[YOUR_API_KEY]
```

### Adding Additional Providers 
To add an additional provider: 
1. Create an account and generate an API key with the new provider.  
2. Complete any additional verification steps (sender email address, website domain) with the provider.
3. In `/src/server/email/types.ts`, add a property to the `EmailProviderTypes`.
4. In `/docker/verify-email.ts`, add a new entry in the `providerMap`, following the existing SENDGRID/RESEND entries. 
5. In `/src/server/email/providers/`, create a new `SomeNewServiceEmailProvider.ts` following the existing Sendgrid/Resend examples.
6. In `/src/server/email/sendEmail.ts`, add your new provider to the `providerMap`.
7. In your .env file, set `CUSTOM_EMAIL_PROVIDER` to the new property created in the `EmailProviderTypes`. 
8. In your .env file, set the `EMAIL_API_KEY` to your provider's api key. 
9. TODO: ADD TEST BEHAVIOR FOR CUSTOM API