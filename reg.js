const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const houseno = document.getElementById('house no');
const road = document.getElementById('road no');
const city = document.getElementById('city');
const district = document.getElementById('district');
const password1 = document.getElementById('password1');
const password2 = document.getElementById('password2');

form.addEventListener('submit', e => {
    e.preventDefault();

    validateInputs();
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const isValidCityName = cityName => {
    // Regular expression to validate city name
    const re = /^[a-zA-Z\s-]{1,50}$/;
    return re.test(String(cityName).toLowerCase());
  }
const isValidRoadNumber = roadNumber => {
    // Regular expression to validate road number
    const re = /^[0-9]{1,4}[A-Za-z]{0,1}$/;
    return re.test(roadNumber);
  }
  const isValidDistrictName = districtName => {
    // Regular expression to validate district name
    const re = /^[a-zA-Z\s-]{1,50}$/;
    return re.test(districtName);
}
const isValidHouseNumber = houseNumber => {
    // Regular expression to validate house number
    const re = /^[0-9]{1,4}[A-Za-z]{0,1}$/;
    return re.test(houseNumber);
  }

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const houseValue = houseno.value.trim();
    const roadValue = road.value.trim();
    const cityValue = city.value.trim();
    const districtValue = district.value.trim();
    const password1Value = password1.value.trim();
    const password2Value = password2.value.trim();

    if(usernameValue === '') {
        setError(username, 'Username is required');
    } else {
        setSuccess(username);
    }

    if(emailValue === '') {
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }
    
    if(houseValue === '') {
        setError(houseno, 'House no. is required');
    } else if (!isValidHouseNumber(houseValue)) {
        setError(houseno, 'Provide a valid House no.');
    } else {
        setSuccess(houseno);
    }

    if(roadValue === '') {
        setError(road, 'Road no. is required');
    } else if (!isValidRoadNumber(roadValue)) {
        setError(road, 'Provide a valid Road no.');
    } else {
        setSuccess(road);
    }

    if(cityValue === '') {
        setError(city, 'City is required');
    } else if (!isValidCityName(cityValue)) {
        setError(city, 'Provide a valid City name');
    } else {
        setSuccess(city);
    }

    if(districtValue === '') {
        setError(district, 'District name is required');
    } else if (!isValidDistrictName(districtValue)) {
        setError(district, 'Provide a valid District name');
    } else {
        setSuccess(district);
    }

    if(password1Value === '') {
        setError(password1, 'Password is required');
    } else if (password1Value.length < 8 ) {
        setError(password1, 'Password must be at least 8 character.')
    } else {
        setSuccess(password1);
    }

    if(password2Value === '') {
        setError(password2, 'Please confirm your password');
    } else if (password2Value !== password1Value) {
        setError(password2, "Passwords doesn't match");
    } else {
        setSuccess(password2);
    }

};
