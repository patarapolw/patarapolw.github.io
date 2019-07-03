---
layout: post
title: "Hosting MongoDB version 4 server on DigitalOcean"
---

My gripe comes from the limitation with free tier and lower tiers of MongoDB Atlas. ([Where can I host MongoDB with allowDiskUse=true?](https://www.quora.com/unanswered/Where-can-I-host-MongoDB-with-allowDiskUse-true)) So, I have decided to host my own MongoDB on DigitalOcean.

<!--more-->

# Setting up a droplet and installing MongoDB

So, this is the only relatively easy part. It can be installed with either

- [One click install](https://pages.news.digitalocean.com/AF2V0vEI30XV5290060l08D)
- Setting up a server from scratch

Since one click install is too easy, yet I don't have a luck with it too much, I am not going to discuss this one. One click install comes with MongoDB 4 already.

To setup a server from scratch, I chose Ubuntu 19.04.

![Screen Shot 2562-07-01 at 07.38.11.png](https://polvcode.files.wordpress.com/2019/07/screen-shot-2562-07-01-at-07.38.11.png)

Then, choose a cheapest tier. This is hidden beneath the left arrow.

![Screen Shot 2562-07-01 at 07.38.27.png](https://polvcode.files.wordpress.com/2019/07/screen-shot-2562-07-01-at-07.38.27.png)

For authentication, use SSH. I am using macOS, so I can create SSH key with [`ssh-keygen -t rsa`](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys--2). After the code is generated, copy the key with `cat ~/.ssh/id_rsa.pub`, but `cat` doesn't work on my machine, so I use `code` instead. (`nano` should also works.)

Then, press "Create".

Then, after the droplet is created, you will see the IP address. Log in to the server with the terminal.

```
$ ssh root@SERVER_IP_ADDRESS
```

To install MongoDB 4, follow the following steps -- <https://tecadmin.net/install-mongodb-on-ubuntu/>, but if you have installed MongoDB 3, you have additional steps to take -- [https://askubuntu.com/a/1054323/5156](https://askubuntu.com/a/1054323/5156)

# Create users on MongoDB and set permissions

<https://docs.mongodb.com/manual/administration/security-checklist/>

- Run `mongo`
- Create user "admin"

```
use admin
db.createUser(
  {
    user: "myUserAdmin",
    pwd: "abc123",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)
```

- DO NOT shutdown the mongod instance
- Login to admin `mongo --port 27017 -u "myUserAdmin" --authenticationDatabase "admin" -p`
- Create additional users

```
use test
db.createUser(
  {
    user: "myTester",
    pwd: "xyz123",
    roles: [ { role: "readWrite", db: "test" },
             { role: "read", db: "reporting" } ]
  }
)
```

- `nano /etc/mongod.conf`, enable `security:`, and add `authorization: enabled`
- Allow your IP address on `ufw` <https://www.howtoforge.com/tutorial/install-mongodb-on-ubuntu/>
	- If you use WiFi, or something that IP address varies, you might consider "Allow from anywhere"

That's it. Now you can login to MongoDB from outside via `mongodb://USERNAME:PASSWORD@SERVER_IP_ADDRESS:27017/test`
