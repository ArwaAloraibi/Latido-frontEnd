import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
    roles: '',
  });

  const { username, password, passwordConf, roles } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf && roles);
  };

  return (
    <main className="sign-up-page">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        {message && (
          <div className="error-message" style={{ marginBottom: '16px' }}>
            {message}
          </div>
        )}
        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            value={username}
            name='username'
            onChange={handleChange}
            placeholder="Choose a username"
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            value={password}
            name='password'
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
        </div>
        <div>
          <label htmlFor='confirm'>Confirm Password:</label>
          <input
            type='password'
            id='confirm'
            value={passwordConf}
            name='passwordConf'
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
        </div>
        <div>
          <label htmlFor='roles'>Role:</label>
          <select
            id='roles'
            value={roles}
            name='roles'
            onChange={handleChange}
            required
          >
            <option value=''>Select a Role</option>
            <option value='listener'>Listener</option>
            <option value='artist'>Artist</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={isFormInvalid()} className="btn-primary" style={{ flex: 1 }}>
              Sign Up
            </button>
            <button type="button" onClick={() => navigate('/')} className="btn-secondary">
              Cancel
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <span style={{ color: 'var(--beige)', fontSize: '14px' }}>Already a user? </span>
            <a href="/sign-in" onClick={(e) => { e.preventDefault(); navigate('/sign-in'); }} style={{ color: 'var(--electropink)', textDecoration: 'none', fontWeight: '600' }}>
              Sign in
            </a>
          </div>
        </div>
      </form>
    </main>
  );
};

export default SignUpForm;
