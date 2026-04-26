import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './Pricing.css';

const plans = [
  {
    name: 'free',
    displayName: 'Free',
    price: 0,
    features: ['Up to 3 projects', '1 user only', 'Basic support'],
    color: '#059669',
  },
  {
    name: 'basic',
    displayName: 'Basic',
    price: 299,
    features: ['Up to 10 projects', 'Up to 5 users', 'Email support', 'Analytics'],
    color: '#2563eb',
    popular: true,
  },
  {
    name: 'pro',
    displayName: 'Pro',
    price: 999,
    features: ['Unlimited projects', 'Unlimited users', 'Priority support', 'Advanced analytics', 'Custom integrations'],
    color: '#7c3aed',
  },
];

const Pricing = () => {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState('');
  const handlePlanSelect = async (plan) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (plan.price === 0) {
      try {
        setLoading('free');
        await API.post('/payment/free-plan');
        await fetchUser();
        alert('Free plan activated!');
        navigate('/dashboard');
      } catch (err) {
        alert(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading('');
      }
      return;
    }

    // Paid plan
    try {
      setLoading(plan.name);

      console.log('Sending planName:', plan.name); // 👈 debug

      const res = await API.post('/payment/create-order', {
        planName: plan.name
      });

      console.log('Order response:', res.data); // 👈 debug

      const { orderId, amount, currency, keyId } = res.data.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'SaaS Platform',
        description: `${plan.displayName} Plan`,
        order_id: orderId,
        handler: async (response) => {
          try {
            console.log('Razorpay response:', response); // 👈 debug
            await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planName: plan.name,
            });
            await fetchUser();
            alert('Payment successful! Plan activated.');
            navigate('/dashboard');
          } catch (err) {
            console.log('Verify error:', err.response?.data); // 👈 debug
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: plan.color,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log('Create order error:', err.response?.data); // 👈 debug
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1>Simple, Transparent Pricing</h1>
        <p>Choose the plan that works best for you</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`pricing-card ${plan.popular ? 'popular' : ''}`}
          >
            {plan.popular && <div className="popular-badge">Most Popular</div>}

            <div className="plan-name" style={{ color: plan.color }}>
              {plan.displayName}
            </div>

            <div className="plan-price">
              {plan.price === 0 ? (
                <span className="price-free">Free</span>
              ) : (
                <>
                  <span className="price-currency">₹</span>
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-period">/month</span>
                </>
              )}
            </div>

            <ul className="plan-features">
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <span className="feature-check" style={{ color: plan.color }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className="btn-plan"
              style={{ background: plan.color }}
              onClick={() => handlePlanSelect(plan)}
              disabled={loading === plan.name}
            >
              {loading === plan.name
                ? 'Processing...'
                : plan.price === 0
                  ? 'Get Started Free'
                  : `Get ${plan.displayName}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;