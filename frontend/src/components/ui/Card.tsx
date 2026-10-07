const Card = ({ title = "-", total = "-", percentage = "-" }: { title?: string; total?: string; percentage?: string  }) => {
    return(
        <div className="border border-gray-300 rounded-2xl space-y-2 p-6 w-full">
            <p className="text-lg font-semibold">{title}</p>
            <div className="flex justify-between items-center">
                <p className="text-2xl font-semibold">{total}</p>
                <p className="text-sm text-blue-600">{percentage}</p>
            </div>
            <p className="text-secondary">Bulan ini</p>
        </div>
    )
}

export default Card;