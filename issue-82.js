console.log("---- issue #82 ----");


const VictronDbusListener =  require('./src/services/dbus-listener.js');

console.log(VictronDbusListener);
const serviceName = 'com.victronenergy.node-red';
const interfaceName = serviceName;
const objectPath = `/${serviceName.replace(/\./g, '/')}`;
const dbus = require('dbus-native/index');

const systemBus = dbus.systemBus();

/*
	Then request our service name to the bus.
	The 0x4 flag means that we don't want to be queued if the service name we are requesting is already
	owned by another service ;we want to fail instead.
*/
systemBus.requestName(serviceName, 0x4, (err, retCode) => {
  // If there was an error, warn user and fail
  if (err) {
    throw new Error(
      `Could not request service name ${serviceName}, the error was: ${err}.`
    );
  }

  // Return code 0x1 means we successfully had the name
  if (retCode === 1) {
    console.log(`Successfully requested service name "${serviceName}"!`);
    proceed();
  } else {
    /* Other return codes means various errors, check here
	(https://dbus.freedesktop.org/doc/api/html/group__DBusShared.html#ga37a9bc7c6eb11d212bf8d5e5ff3b50f9) for more
	information
	*/
    throw new Error(
      `Failed to request service name "${
        serviceName
      }". Check what return code "${retCode}" means.`
    );
  }
});

// Function called when we have successfully got the service name we wanted
function proceed() {
  // Now we need to actually export our interface on our object
  //systemBus.exportInterface(iface, objectPath, ifaceDesc);

  // Say our service is ready to receive function calls (you can use `gdbus call` to make function calls)
  console.log('Interface exposed to DBus, ready to receive function calls!');

  // Add a path
var exampleIface = {
  name: 'com.example.service',
  methods: {
    doStuff: ['s', 's'],
    timesTwo: ['d', 'd'],
    respondWithDouble: ['s', 'd']
  },
  signals: {
    testsignal: ['us', 'name1', 'name2']
  },
  properties: {
    TestProperty: 'y'
  }
};

var example = {
  respondWithDouble: function(s) {
    console.log(`Received "${s}'`);
    return 3.14159;
  },
  timesTwo: function(d) {
    console.log(d);
    return d * 2;
  },
  doStuff: function(s) {
    return `Received "${s}" - this is a reply`;
  },
  TestProperty: 42,
  emit: function(name, param1, param2) {
    console.log('signal emit', name, param1, param2);
  }
};
  systemBus.exportInterface(example, '/com/github/sidorares/1', exampleIface);


}
