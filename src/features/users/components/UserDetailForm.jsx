import userProfile from "@/assets/images/user-profile.png";


export default function UserDetailForm({ user }) {
  return (
    <div className=" bg-black text-white rounded-3xl p-10 max-w-6xl mx-auto grid grid-cols-3 gap-8 items-center border border-yellow-700">
      {/*Título */}
      <div className="col-span-3 flex items-center gap-3 mb-4">
        <span className="text-3xl font-semibold"> Visualizar usuarios</span>
      </div>

      {/* Datos del usuario */}
      <div className="col-span-2 grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Tipo de documento</label>
          <input
            type="text"
            value={user.documentType}
            readOnly
            className="w-full bg-transparent border border-gray-400 rounded-md px-3 py-2 text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
          <input
            type="text"
            value={user.email}
            readOnly
            className="w-full bg-transparent border border-gray-400 rounded-md px-3 py-2 text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Número de documento</label>
          <input
            type="text"
            value={user.documentNumber}
            readOnly
            className="w-full bg-transparent border border-gray-400 rounded-md px-3 py-2 text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Número telefónico</label>
          <input
            type="text"
            value={user.phone}
            readOnly
            className="w-full bg-transparent border border-gray-400 rounded-md px-3 py-2 text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Nombre completo</label>
          <input
            type="text"
            value={user.fullName}
            readOnly
            className="w-full bg-transparent border border-gray-400 rounded-md px-3 py-2 text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Dirección residencial</label>
          <input
            type="text"
            value={user.address}
            readOnly
            className="w-full bg-transparent border border-gray-400 rounded-md px-3 py-2 text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Tipo de usuario</label>
          <input
            type="text"
            value={user.userType}
            readOnly
            className="w-full bg-transparent border border-gray-400 rounded-md px-3 py-2 text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Fecha inicio laboral</label>
          <input
            type="text"
            value={user.startDate}
            readOnly
            className="w-full bg-transparent border border-gray-400 rounded-md px-3 py-2 text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Fecha fin laboral</label>
          <input
            type="text"
            value={user.endDate}
            readOnly
            className="w-full bg-transparent border border-gray-400 rounded-md px-3 py-2 text-gray-300"
          />
        </div>
      </div>

      {/* Imagen y estado */}
      <div className="flex flex-col items-center justify-center gap-4">
       <img
             src={userProfile}
             alt={user.fullName}
             className="w-48 h-48 object-cover rounded-xl border-4 border-amber-500"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm">Estado del usuario:</span>
          <span
            className={`w-3 h-3 rounded-full ${
              user.active ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
        </div>
      </div>
    </div>
  );
}
