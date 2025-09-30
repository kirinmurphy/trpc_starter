import { ReadmeSection } from './ReadmeSection';

const readmeSections = [
  {
    readmes: [
      'https://github.com/kirinmurphy/trpc_starter/blob/main/README.md',
    ],
  },
  {
    title: 'Infra / Devops',
    toc: [
      'Local HTTPs Setup',
      'Email Service',
      'Cypress Testing Environment',
      'External HTTPs Edge Router',
    ],
    offset: 180,
    readmes: [
      'https://github.com/kirinmurphy/trpc_starter/blob/main/docs/mkcert-setup.md',
      'https://github.com/kirinmurphy/trpc_starter/blob/main/docs/email.md',
      'https://github.com/kirinmurphy/trpc_starter/blob/main/docs/cypress_options.md',
      'https://github.com/kirinmurphy/traefik_vps/blob/main/README.md',
    ],
  },
  {
    title: 'User and Account Management',
    toc: [
      'Super Admin Setup',
      'User Creation and Authentication',
      'Password Reset Workflow',
    ],
    offset: 150,
    readmes: [
      'https://github.com/kirinmurphy/trpc_starter/blob/main/docs/super_admin_setup.md',
      'https://github.com/kirinmurphy/trpc_starter/blob/main/docs/auth.md',
      'https://github.com/kirinmurphy/trpc_starter/blob/main/docs/password_reset.md',
    ],
  },
];

export function ReadmeDefault() {
  return (
    <>
      {readmeSections.map((section, index) => (
        <ReadmeSection
          {...section}
          sectionIndex={index}
          key={section.readmes[0]}
        />
      ))}
    </>
  );
}
