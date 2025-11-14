const getCustomerId = (customerId: string | null | undefined): string => {
    let customer = '';

    if(customerId){
        customer = customerId.split('/').at(-1) || '';
    }
    
	return customer;
};

export default getCustomerId;
