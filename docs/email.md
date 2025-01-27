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


