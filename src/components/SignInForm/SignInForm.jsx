import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className="sign-in-page">
      <form autoComplete='off' onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        {message && (
          <div className="error-message" style={{ marginBottom: '16px' }}>
            {message}
          </div>
        )}
        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            autoComplete='off'
            id='username'
            value={formData.username}
            name='username'
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            autoComplete='off'
            id='password'
            value={formData.password}
            name='password'
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Sign In
            </button>
            <button type="button" onClick={() => navigate('/')} className="btn-secondary">
              Cancel
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <span style={{ color: 'var(--beige)', fontSize: '14px' }}>Don't have an account? </span>
            <a href="/sign-up" onClick={(e) => { e.preventDefault(); navigate('/sign-up'); }} style={{ color: 'var(--electropink)', textDecoration: 'none', fontWeight: '600' }}>
              Create new account
            </a>
          </div>
        </div>
      </form>
    </main>
  );
};

export default SignInForm;
