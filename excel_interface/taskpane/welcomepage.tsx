const { React, FluentUIReact } = window;

export default function WelcomePage(props) {

   return (
      <div>
         <h1>Welcome {props.username}</h1>
         <h2>you are now successfully logged in</h2>
         <button type="submit" onClick={() => { props.onLogout() }}>
            Logout
      </button>
         <button type="submit" onClick={() => { props.onDelete() }}>
            Delete User
      </button>
      </div>
   )
};

