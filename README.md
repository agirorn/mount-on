mount-on
========

Mount any local directory on a remote machine via ssh + sshfs.

## Installation

`npm install -g jasmine`

## Usage

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
