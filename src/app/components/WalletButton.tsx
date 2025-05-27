export const WalletButton = ({ onClick, children, enabled, loading, scrollToWallet, text }: {
  onClick: () => void;
  children: React.ReactNode,
  enabled?: boolean,
  loading?: boolean,
  scrollToWallet?: () => void
  text?: string
}) => (
  <span
    className="tooltip tooltip-right"
    data-tip={enabled ? (loading ? "Processing..." : "") : text ? text : "Please create or import a wallet first"}
  >
    <button
      className={`btn bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none text-white shadow-md relative overflow-hidden ${!enabled || loading ? 'grayscale' : ''}`}
      disabled={!enabled || loading}
      onClick={enabled ? onClick : scrollToWallet}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent z-0"></div>
      <span className="relative z-10 flex items-center gap-2">
        {loading && <span className="loading loading-spinner loading-sm text-white"></span>}
        {children}
      </span>
    </button>
  </span>
);
