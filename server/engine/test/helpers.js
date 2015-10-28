const mock = require('node-mocks-http');
module.exports.req  = mock.createRequest({
  method: 'GET',
  url: '/users/42?hello=bob',
  headers: {
    cookie: 'SQLiteManager_currentLangue=2; 9d4bb4a09f511681369671a08beff228=1960057a1d7425da8e8b786cba80304b; da0e0ec32fc289e9f021e3d8bc4e9c0f=1defbe0a4bae6f7abb4e53adf098c529; 6338a5217de3e85c1a237daeff2b4627=6a747d0da7abd5c318cae7753c5adde5; fabric_manage_cohortid=; fabric_manage_groupid=; fabric_guide=library%2Cadmin_home%2Cprofile%2C; _nnfab_session=VmR6ZlJQUEZEU2lTTVkxZEJRY0w2U1NONU1MNHlqdkJ3OW05c0gyNVNpaXoyYXFTUndjeTkwK21sYVNTUGdoVUFacXo5QnI5NU94L2twcCsxSHFVT0FEbzR4NlFSeUpnRGpUYnovTDJkdnhtbklSdUdRSUhSTjh4VVpGUDVxSnYwVkE4R3Y4S1NBYnNxQSsxbWdOTWprTW5Gd1hKM3NoZVBlajRPWEJ5R3Yxc1psQ0xkODNscGJBTSszckhTUGtwVmxwM2FyTTExRE5yVVgrekFuMXBrTzd3RWN2VHNQQzJEK3hZSmJ5SFJtMFZ3cElETzk4bEE2SGlHRGUvdGphUHJRUzkrZ3lxY0xKN2ZLaUJBd1RjMVBpdUN6b3FlOEhROFB2Z0xjZ3U4QVY1eGxnOHFPdk9kR0g0K2xBdVlrMUVLVU9HcTNVeUo5T0FoSjN2NE1VNERpeU5ITUhoa1J3aXU5K0M1aTd3aE83SHZUZTNDaFFVNjRDYitkSEgzZmU1eEhzMW1XQWViK3VSLzN5ejU1dU9iTVRQZFpTWkExVXhFRE1Ceko3Yzk2cz0tLUJuWFhwY0JuWU42a2hSN1NsNE9XZlE9PQ%3D%3D--4b1f6acdfbe07579a73f621ce4401a0d512d3da9; tabstyle=html-tab; __ngDebug=true; sessionid=3qd36xnt76gzk50o5qr9vxyyyxglrm3s; csrftoken=oMvsLl01G2HPFOxXDUJHmGWHLjTxoaJl'
  }
});
module.exports.req_simple = mock.createRequest({
  method: 'GET',
  url: '/'
});
module.exports.res  = mock.createResponse();
