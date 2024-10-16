# User Auth Sequence

```mermaid
%%{init: {"theme": "dark", "themeVariables": { "primaryColor": "#ff6e6e", "secondaryColor": "#feb236", "tertiaryColor": "#6cb1ff" }}}%%

flowchart TD
  A[Recommender] --> B[Recommendee1]
  A --> C[Recommendee2]
  A --> D[Recommendee3]
  B --> C
  C --> B
  B --> E[Recommendee3]
  B --> F[Recommendee4]
  B --> G[Recommendee5]
  C --> H[Recommendee6]
  C --> I[Recommendee7]
  C --> J[Recommendee8]
  J --> B
  J --> C
  L --> A
  L --> F
  K --> A
  M --> G
  K --> B
  D --> K[Recommendee9]
  D --> L[Recommendee10]
  D --> M[Recommendee11]
```
