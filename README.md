#Informe de Desarrollo Full Stack - TaskTogether

Alexander Baikálov 2 DAW 2022-2023 IES La Pineda

Resumen

TaskTogether es una aplicación de full-stack diseñada para facilitar la gestión de tareas en colaboración. Construida con los marcos de Spring Boot y React, presenta la creación de grupos de tareas donde los usuarios pueden unirse con sus amigos. Los amigos también pueden invitar a sus propios amigos, creando así una red interactiva de intercambio de tareas.

Tecnologías utilizadas

·*Backend*: El backend de la aplicación se desarrolló utilizando Spring Boot. La elección se basó en la robustez y madurez del marco, que ofrece una amplia gama de funcionalidades, lo que facilita la construcción de un backend escalable y seguro.

·*Frontend*: El frontend de la aplicación se desarrolló utilizando React. React fue elegido debido a su arquitectura basada en componentes y la posibilidad de crear una interfaz de usuario interactiva con una excelente experiencia de usuario.

·Autenticación: La autenticación se manejó mediante la integración de Auth0, una solución flexible para agregar servicios de autenticación y autorización. Se utilizaron tokens de web JSON (JWT) para transmitir información de manera segura entre las partes.

Cronología del Desarrollo

https://github.com/alexanderbkl/spring-boot-kotlin

·15 de Abril, 2023: Inicialización del proyecto - Clonar proyecto de antoniopapa (Spring Boot getting started).

·20 de Abril, 2023: Se agregó el sistema de autenticación en Kotlin (en un principio, posteriormente migrado a Kotlin).

·21 de Abril, 2023: Spring Boot y React se agregaron al proyecto. Comienzo de la fase principal de desarrollo.

·23 de Abril, 2023: Se agregaron dos características: la funcionalidad de solicitud de amigos y la capacidad de agregar usuarios a grupos de tareas. Ampliación los aspectos colaborativos de la aplicación y mejora la experiencia del usuario.

·25 de Abril, 2023: Añadir nuevas tareas al sistema. Funcionalidad crucial que hizo que la aplicación fuera utilizable.

·22 de Mayo, 2023: Se resolvieron errores de tipeo y se actualizó el estado del formulario anidado de edición de tareas. El tipado forma parte de la depuración y el mantenimiento contínuo de la aplicación, garantizando que la aplicación funcione sin problemas y sin errores.

·24 de Mayo, 2023: Se agregó la funcionalidad de actualizar tareas. Permitir a los usuarios modificar tareas existentes, proporcionando un sistema de gestión de tareas más completo.

·25 de Mayo, 2023: Editar tareas. Esto implicó dar los toques finales al sistema de gestión de tareas, asegurándose de que fuera pulido y fácil de usar.

·28 de Mayo, 2023: Terminar de acabar la aplicación (Editar estado (PENDIENTE; POR HACER; FINALIZADA), poder borrar tareas y terminar de refinar alguna que otra cosilla.
