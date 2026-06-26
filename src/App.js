import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        const web3Instance = new Web3(window.ethereum);

        setWeb3(web3Instance);
        setAccount(accounts[0]);

        const weiBalance = await web3Instance.eth.getBalance(accounts[0]);
        const ethBalance = web3Instance.utils.fromWei(weiBalance, 'ether');
        setBalance(parseFloat(ethBalance).toFixed(4));

        // Get network
        const chainId = await web3Instance.eth.getChainId();
        const networks = {
          1: 'Ethereum Mainnet',
          5: 'Goerli',
          11155111: 'Sepolia'
        };
        setNetwork(networks[chainId] || 'Unknown');

        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 3000);

      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const sendTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTxHash(null);

    try {
      if (!web3.utils.isAddress(toAddress)) {
        alert('Invalid address!');
        return;
      }

      const weiAmount = web3.utils.toWei(amount, 'ether');

      const tx = await web3.eth.sendTransaction({
        from: account,
        to: toAddress,
        value: weiAmount,
        gas: 21000
      });

      setTxHash(tx.transactionHash);
      setToAddress('');
      setAmount('');

      const newBalance = await web3.eth.getBalance(account);
      setBalance(parseFloat(web3.utils.fromWei(newBalance, 'ether')).toFixed(4));

    } catch (error) {
      alert('Transaction failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  // Custom styles
  const styles = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)',
    border: 'none',
    transition: 'transform 0.3s ease'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '50px',
    padding: '12px 30px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    borderRadius: '10px',
    border: '2px solid #e0e0e0',
    padding: '12px',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={styles}>
      {/* Animated Background Bubbles */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 5}s infinite`,
              pointerEvents: 'none'
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
          }
          
          .btn-gradient:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }
          
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 25px 40px rgba(0,0,0,0.4);
          }
          
          input:focus {
            border-color: #764ba2 !important;
            box-shadow: 0 0 0 0.2rem rgba(118, 75, 162, 0.25) !important;
            outline: none !important;
          }
        `}
      </style>

      <div className="container mt-4" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header with Animation */}
        <div className="text-center mb-5">
          <h1
            style={{
              color: 'white',
              fontSize: '3.5rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              animation: showAnimation ? 'pulse 0.5s ease' : 'none'
            }}
          >
            🚀 EthSphere
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem' }}>
            Penerapan Blockchain dalam Sistem Pembayaran Digital untuk Menjamin Transparansi Transaksi
          </p>
        </div>

        {!account ? (
          <div className="text-center">
            <button
              className="btn-gradient"
              onClick={connectWallet}
              style={{
                ...buttonStyle,
                fontSize: '1.2rem',
                padding: '15px 40px'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              🔗 Connect MetaMask Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Account Info Card */}
            <div className="card mb-4 card-hover" style={cardStyle}>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h5 className="card-title" style={{ color: '#667eea', fontSize: '1.5rem' }}>
                      ✅ Wallet Connected
                    </h5>
                    <p style={{ marginBottom: '10px' }}>
                      <strong style={{ color: '#764ba2' }}>Address:</strong>
                      <code style={{ background: '#f5f5f5', padding: '5px', borderRadius: '5px', display: 'inline-block', marginLeft: '10px' }}>
                        {account.slice(0, 10)}...{account.slice(-8)}
                      </code>
                    </p>
                    <p>
                      <strong style={{ color: '#764ba2' }}>Network:</strong>
                      <span className="badge" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', marginLeft: '10px', padding: '5px 15px' }}>
                        {network}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-4 text-center">
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: '20px',
                      padding: '20px',
                      color: 'white'
                    }}>
                      <small>Current Balance</small>
                      <h2 style={{ margin: '10px 0', fontSize: '2rem' }}>{balance} ETH</h2>
                      <small>≈ ${(balance * 3500).toFixed(2)} USD</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Transaction Card */}
            <div className="card card-hover" style={cardStyle}>
              <div className="card-body">
                <h5 className="card-title" style={{ color: '#667eea', fontSize: '1.5rem', marginBottom: '20px' }}>
                  💸 Send Cryptocurrency
                </h5>
                <form onSubmit={sendTransaction}>
                  <div className="mb-4">
                    <label className="form-label" style={{ fontWeight: 'bold', color: '#764ba2' }}>
                      <span style={{ fontSize: '1.2rem' }}>👤</span> Recipient Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={inputStyle}
                      placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"
                      value={toAddress}
                      onChange={(e) => setToAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label" style={{ fontWeight: 'bold', color: '#764ba2' }}>
                      <span style={{ fontSize: '1.2rem' }}>💰</span> Amount (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      className="form-control"
                      style={inputStyle}
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                    {amount && (
                      <small className="text-muted mt-2" style={{ display: 'block' }}>
                        ≈ ${(parseFloat(amount) * 3500).toFixed(2)} USD
                      </small>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-gradient"
                    style={buttonStyle}
                    disabled={loading}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing Transaction...
                      </>
                    ) : (
                      '🚀 Send Transaction'
                    )}
                  </button>
                </form>

                {txHash && (
                  <div className="alert alert-success mt-4" style={{ borderRadius: '10px', borderLeft: '4px solid #28a745' }}>
                    <strong>✅ Transaction Successful!</strong>
                    <br />
                    <small>Transaction Hash:</small>
                    <br />
                    <code style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{txHash}</code>
                    <br />
                    <a
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      🔍 View on Etherscan →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips Card */}
            <div className="card mt-4" style={{ ...cardStyle, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}>
              <div className="card-body">
                <h6 style={{ marginBottom: '15px' }}>💡 Quick Tips</h6>
                <div className="row">
                  <div className="col-md-4">
                    <small>✓ Network: Sepolia Testnet</small>
                  </div>
                  <div className="col-md-4">
                    <small>✓ Gas Fee: ~0.00021 ETH</small>
                  </div>
                  <div className="col-md-4">
                    <small>✓ Transaction Time: ~15 seconds</small>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;