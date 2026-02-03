const getUserFullName = user => {
    if (!user) return '';
    const { firstName, lastName } = user;
    return `${firstName} ${lastName}`;
};

export { getUserFullName };
