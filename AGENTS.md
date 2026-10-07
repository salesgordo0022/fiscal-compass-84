# Architecture rules
- Initialize authentication through one ordered, server-validated lifecycle; ignore stale async results so logout cannot restore an old user.
- Create public profiles and protected roles through the Auth signup trigger; shared accounting records remain readable by authenticated users and writable only by administrators.