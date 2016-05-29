mount-on
========

Mount any local directory on a remote machine via ssh + sshfs.

## Installation

`npm install -g mount-on`

## Usage

**mount ~/directory-name on 192.168.33.10:/home/user/directory-name**

```
mount-on --local-host=192.168.33.20 \
         --local-folder=/home/user/directory-name \
         --local-user=vagrant \
         --local-password=vagrant \
         --remote-host=192.168.33.10 \
         --remote-folder=/home/user/directory-name \
         --remote-user=vagrant \
         --remote-password=vagrant
```

**mount ~/directory-name on 127.0.0.1:/home/user/directory-name**

```
mount-on user@127.0.0.1 ~/directory-name
```

**mount current working directory on 127.0.0.1:/home/user/directory-name.**

```
cd ~/directory-name
mount-on 127.0.0.1 .
```


**mount current working directory on**

```
127.0.0.1:/home/user/directory-name.
cd ~/directory-name
mount-on 127.0.0.1
```
