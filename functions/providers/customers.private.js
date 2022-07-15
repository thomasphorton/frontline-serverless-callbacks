// For Inbound Routing: Map between customer address and worker identity
// Used to determine to which worker a new conversation with a particular customer should be routed to.
// {
//     customerAddress: workerIdentity
// }
//
// Example:
//     {
//         'whatsapp:+12345678': 'john@example.com'
//     }
const customersToWorkersMap = {};

// Customers list
// Example:
// [
//   {
//      customer_id: 98,
//      display_name: 'Bobby Shaftoe',
//      channels: [
//          { type: 'email', value: 'bobby@example.com' },
//          { type: 'sms', value: '+123456789' },
//          { type: 'whatsapp', value: 'whatsapp:+123456789' }
//      ],
//      links: [
//          { type: 'Facebook', value: 'https://facebook.com', display_name: 'Social Media Profile' }
//      ],
//      details:{
//          title: "Information",
//          content: "Status: Active" + "\n\n" + "Score: 100"
//      },
//      worker: 'john@example.com'
//   }
// ]

const customers = [
    {
        customer_id: 98,
        display_name: 'Tom Horton',
        channels: [
            { type: 'email', value: 'thorton@twilio.com' },
            { type: 'sms', value: '+19196499613' }
        ],
        links: [
            { type: 'Facebook', value: 'https://facebook.com', display_name: 'Social Media Profile' }
        ],
        details:{
            title: "Information",
            content: "Status: Active" + "\n\n" + "Score: 100"
        },
        worker: 'thorton@twilio.com'
    },
    {
        customer_id: 99,
        display_name: 'Foo Bar',
        channels: [
            { type: 'email', value: 'thorton+foo-bar@twilio.com' },
            { type: 'sms', value: '+12068097526' }
        ],
        links: [
            { type: 'Facebook', value: 'https://facebook.com', display_name: 'Social Media Profile' }
        ],
        details:{
            title: "Information",
            content: "Status: Active" + "\n\n" + "Score: 100"
        },
        worker: 'thorton@twilio.com'
    }
];

const findWorkerForCustomer = async (customerNumber) => customersToWorkersMap[customerNumber];

const findRandomWorker = async () => {
    const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
    }

    const workers = Object.values(customersToWorkersMap).filter(onlyUnique)
    const randomIndex = Math.floor(Math.random() * workers.length)

    return workers[randomIndex]
}

const getCustomersList = async (worker, pageSize, anchor) => {
    const workerCustomers = customers.filter(customer => customer.worker.toLowerCase() === worker.toLowerCase());
    const list = workerCustomers.map(customer => ({
        display_name: customer.display_name,
        customer_id: customer.customer_id,
        avatar: customer.avatar,
    }));

    if (!pageSize) {
        return list
    }

    if (anchor) {
        const lastIndex = list.findIndex((c) => String(c.customer_id) === String(anchor))
        const nextIndex = lastIndex + 1
        return list.slice(nextIndex, nextIndex + pageSize)
    } else {
        return list.slice(0, pageSize)
    }
};

const getCustomerByNumber = async (customerNumber) => {
    return customers.find(customer => customer.channels.find(channel => String(channel.value) === String(customerNumber)));
};

const getCustomerById = async (customerId) => {
    return customers.find(customer => String(customer.customer_id) === String(customerId));
};

module.exports = {
    customersToWorkersMap,
    findWorkerForCustomer,
    findRandomWorker,
    getCustomerById,
    getCustomersList,
    getCustomerByNumber
};
