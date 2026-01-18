interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({
    className = '',
    width,
    height,
    rounded = 'md'
}: SkeletonProps) {
    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    return (
        <div
            className={`skeleton ${roundedClasses[rounded]} ${className}`}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
            }}
        />
    );
}

// Pre-built skeleton variants
export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    height={16}
                    width={i === lines - 1 ? '75%' : '100%'}
                />
            ))}
        </div>
    );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-white rounded-xl border border-light-gray p-4 ${className}`}>
            <Skeleton height={200} width="100%" rounded="lg" className="mb-4" />
            <Skeleton height={20} width="60%" className="mb-2" />
            <SkeletonText lines={2} />
        </div>
    );
}

export function SkeletonImage({ className = '' }: { className?: string }) {
    return (
        <div className={`aspect-square ${className}`}>
            <Skeleton height="100%" width="100%" rounded="lg" />
        </div>
    );
}

export default Skeleton;
