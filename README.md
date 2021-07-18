# Separoler

A single-purpose utility bot for automating the addition and removal of separator roles on Discord.

## What are Separoles?

When you have tons of roles that users can equip, we understand that it can be a huge eyesore.

Setting up **[Separoles](https://www.reddit.com/r/discordapp/comments/a39fap/custom_role_separators/)** allows server owners to create many different categories of roles (eg. levelled roles, color roles), without confusing new users when they look at your active members' profile.

![Separole Example](https://cdn.discordapp.com/attachments/839374553109364786/843423015197868032/unknown.png)
## Why use Separoler Bot?

**Separoler Bot** is a simple utility bot that focuses solely on the automatic addition and removal of **Separoles** for each of your users.

Just create the **Separole** and it will be added to a user when it can be displayed in-between two other roles.

With extensive configuration options, you can customize the way that **Separoles** are displayed for your server, exactly the way you want to.

## Features
Enter `s!help` to view the list of all commands.
### Add and Remove Separoles `s!separoles`

Easily view, add, and remove separoles from your server with a single command.

Enter `s!separoles` to view all your current separoles.
Enter `s!separoles add <role>` to add a separole.
Enter `s!separoles remove <separole>` to remove a separole.

### Configuration `s!config`

Customize how you'd like Separoler Bot to add or remove Separoles when they are the top-most role the user has, or when Separoles are displayed together.

![Separole Configuration Example](https://cdn.discordapp.com/attachments/839374553109364786/843437033065283614/unknown.png)

Enter `s!config edit <policy> <setting>` to modify the configuration settings for how separoles are displayed in your server.

### Separole Groups `s!groups`

By default, Separoles will appear when they are in between any 2 roles.

However, if you want a Separole to show up only when a role from a certain group is added to the user, add non-separole roles to a separole group.

Enter `s!groups ` to view all your separole groups.
Enter `s!groups add <separole> <role>` to add a single role to a separole group.
Enter `s!groups add <separole> <role1> <role2>` to add multiple roles to a separole group at the same time.

### Debug Information at your Fingertips `s!debug`

Display debug information for your server to see if Separoler is working properly.

![Separoler Debug Information example](https://cdn.discordapp.com/attachments/839374553109364786/843445491987513354/unknown.png)
