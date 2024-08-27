import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
// import { FaGoogle } from "react-icons/fa"; // Import Google icon
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { setUser } = ChatState();
  var credentialResponseDecoded;

  const submitUsingGoogle = async () => {
    setLoading(true);
    const name = credentialResponseDecoded.name;
    const email = credentialResponseDecoded.email;
    const pic = credentialResponseDecoded.picture.toString();

    console.log(pic);

    try {
      // Upload the image to Cloudinary
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dnfxqqmqa");

      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dnfxqqmqa/image/upload",
        {
          method: "post",
          body: data,
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();
      const uploadedPicUrl = cloudinaryData.url.toString();

      console.log(uploadedPicUrl);

      // Now that the pic is uploaded, send the request to your server
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        "/api/user/googleAuth",
        { name, email, pic: uploadedPicUrl },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setUser(response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      history.push("/chats");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guestuser@example.com");
          setPassword("guest");
        }}
      >
        Get Guest User Credentials
      </Button>
      {/* <Button
        leftIcon={<FaGoogle />} // Add Google icon
        colorScheme="red"
        variant="outline"
        width="100%"
        onClick={handleGoogleLogin}
      >
        Login with Google
      </Button> */}
      {/* <div>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            credentialResponseDecoded = jwtDecode(
              credentialResponse.credential
            );
            submitUsingGoogle();
            // console.log(credentialResponseDecoded);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div> */}
    </VStack>
  );
};

export default Login;
